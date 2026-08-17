from typing import List
from fastembed import TextEmbedding

class LangChainEmbeddings:
    """
    LangChain-compatible Embeddings interface backed by local CPU FastEmbed.
    Model: BAAI/bge-small-en-v1.5 (384 dimensions matching Supabase VECTOR(384))
    """
    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        self.model = TextEmbedding(model_name=model_name)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        generator = self.model.embed(texts)
        return [vec.tolist() for vec in generator]

    def embed_query(self, text: str) -> List[float]:
        if not text:
            return []
        generator = self.model.embed([text])
        return list(generator)[0].tolist()

embedding_service = LangChainEmbeddings()
