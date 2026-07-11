export class TfIdf {
  private documents: Map<string, number>[] = [];

  addDocument(text: string) {
    const terms = text.trim().split(/\s+/).filter(Boolean);
    const termFreqs = new Map<string, number>();
    for (const term of terms) {
      termFreqs.set(term, (termFreqs.get(term) || 0) + 1);
    }
    const totalTerms = terms.length;
    const normalized = new Map<string, number>();
    for (const [term, count] of termFreqs) {
      normalized.set(term, count / totalTerms);
    }
    this.documents.push(normalized);
  }

  tfidf(term: string, docIndex: number): number {
    if (docIndex < 0 || docIndex >= this.documents.length) return 0;
    const doc = this.documents[docIndex];
    const tf = doc.get(term) || 0;
    if (tf === 0) return 0;
    let docsWithTerm = 0;
    for (const d of this.documents) {
      if (d.has(term)) docsWithTerm++;
    }
    const idf = Math.log(this.documents.length / docsWithTerm);
    return tf * idf;
  }
}
