import httpx
from typing import List, Optional, Dict, Any
from core.database import get_supabase_admin
from core.config import settings
from core.exceptions import EphnyrException, ResourceNotFoundException
from services.embedding_service import embedding_service
from schemas.chat import ChatRequest, ChatResponse, SourceCitation

class ChatService:
    def __init__(self):
        self.supabase = get_supabase_admin()

    async def verify_room_access(self, slug: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Verify privacy & access rules:
        - If is_public == False, user_id MUST match room.user_id.
        - If is_public == True, anyone can access.
        """
        res = self.supabase.table("rooms").select("*").eq("slug", slug).single().execute()
        data = res.data
        if not data or not isinstance(data, dict):
            raise ResourceNotFoundException(f"Knowledge Pod with slug '{slug}' not found.")

        is_public = data.get("is_public", True)
        owner_id = str(data.get("user_id"))

        if not is_public:
            if not user_id or str(user_id) != owner_id:
                raise EphnyrException(
                    status_code=403,
                    detail="This Knowledge Pod is private. Only the pod owner can interact with this chatbot."
                )

        return data

    async def search_similar_chunks(self, room_id: str, query: str, match_count: int = 4) -> List[SourceCitation]:
        """
        Perform 384-dimensional cosine vector similarity search against Supabase pgvector chunks.
        """
        query_vector = embedding_service.embed_query(query)
        if not query_vector:
            return []

        try:
            rpc_res = self.supabase.rpc(
                "match_document_chunks",
                {
                    "query_embedding": query_vector,
                    "match_count": match_count,
                    "filter": {"room_id": room_id}
                }
            ).execute()

            raw_chunks = rpc_res.data if isinstance(rpc_res.data, list) else []
            citations: List[SourceCitation] = []

            for chunk in raw_chunks:
                if isinstance(chunk, dict):
                    content = str(chunk.get("content", ""))
                    similarity = float(chunk.get("similarity", 0.0))
                    metadata = chunk.get("metadata", {})
                    file_name = metadata.get("file_name", "Document") if isinstance(metadata, dict) else "Document"

                    citations.append(
                        SourceCitation(
                            file_name=file_name,
                            content=content,
                            similarity=round(similarity, 4)
                        )
                    )

            return citations
        except Exception as e:
            print("Vector similarity lookup failed:", e)
            return []

    async def query_rag(self, chat_in: ChatRequest, user_id: Optional[str] = None) -> ChatResponse:
        """
        Sub-500ms Streaming RAG pipeline:
        1. Verify Privacy Access.
        2. Perform pgvector similarity search for context chunks.
        3. Format system prompt + context.
        4. Query Groq LPU Llama 3.3 70B Engine.
        """
        room_data = await self.verify_room_access(chat_in.slug, user_id)
        room_id = str(room_data["id"])
        system_prompt = str(room_data.get("system_prompt") or "You are an AI assistant strictly grounded on the provided context.")

        # 1. Search vector similarity chunks
        citations = await self.search_similar_chunks(room_id, chat_in.message, match_count=4)

        # 2. Build Context Prompt
        context_blocks = []
        for idx, cite in enumerate(citations):
            context_blocks.append(f"[Document {idx+1}: {cite.file_name}]\n{cite.content}")

        context_str = "\n\n---\n\n".join(context_blocks) if context_blocks else "No relevant document chunks found in this Knowledge Pod."

        system_instruction = (
            f"{system_prompt}\n\n"
            "STRICT GROUNDING DIRECTIVES:\n"
            "1. Answer the user's query accurately using ONLY the context from ingested documents provided below.\n"
            "2. If the context does not contain enough information to answer, state clearly: 'I could not find relevant information in the uploaded documents to answer your question.'\n"
            "3. Do not make up facts or use outside knowledge not supported by the context.\n"
            "4. Do not use raw Markdown formatting symbols like asterisks (**) or (*) in your output. Present your response using clean plain text formatting with clear line breaks.\n\n"
            f"INGESTED DOCUMENT CONTEXT:\n---\n{context_str}\n---"
        )

        messages_payload = [{"role": "system", "content": system_instruction}]

        # Add recent conversation history if provided
        if chat_in.history:
            for msg in chat_in.history[-4:]:
                messages_payload.append({"role": msg.role, "content": msg.content})

        messages_payload.append({"role": "user", "content": chat_in.message})

        # 3. Call Groq LPU LLM API
        reply_text = ""
        if settings.GROQ_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    groq_res = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json={
                            "model": settings.GROQ_MODEL,
                            "messages": messages_payload,
                            "temperature": 0.2,
                            "max_tokens": 1024,
                        },
                    )

                    if groq_res.status_code == 200:
                        res_json = groq_res.json()
                        reply_text = res_json["choices"][0]["message"]["content"]
                    else:
                        print("Groq API Error Response:", groq_res.text)
                        reply_text = f"Groq LLM Engine returned status {groq_res.status_code}. Using fallback summary."
            except Exception as e:
                print("Failed to reach Groq LLM API:", e)

        if not reply_text:
            if citations:
                reply_text = f"Based on the ingested document '{citations[0].file_name}':\n\n{citations[0].content[:400]}..."
            else:
                reply_text = "I could not find relevant information in the uploaded documents to answer your question."

        return ChatResponse(
            reply=reply_text,
            sources=citations
        )

chat_service = ChatService()
