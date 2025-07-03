export class Complements {
    /**
     * Junta o XML da NF-e assinada e o protocolo de autorização da SEFAZ, formando o `nfeProc`.
     * @param xmlAssinado XML da NF-e já assinado (string)
     * @param xmlResposta XML da SEFAZ com <protNFe> (string)
     * @returns XML `nfeProc` completo
     */
    static toAuthorize(xmlAssinado, xmlResposta) {
        const protNFe = this.extractTag(xmlResposta, 'protNFe');
        const versao = this.extractVersao(xmlAssinado) || '4.00';
        return this.join(xmlAssinado, protNFe, 'nfeProc', versao);
    }
    /**
     * Extrai a tag desejada do XML, como <protNFe>...</protNFe>
     */
    static extractTag(xml, tag) {
        const match = xml.match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'm'));
        if (!match) {
            throw new Error(`Tag <${tag}> não encontrada no XML.`);
        }
        return match[0];
    }
    /**
     * Extrai a versão da NF-e do XML assinado, ex: versao="4.00"
     */
    static extractVersao(xml) {
        const match = xml.match(/<infNFe[^>]+versao="([\d.]+)"/);
        return match ? match[1] : null;
    }
    /**
     * Junta as partes no formato correto, com tag raiz `nfeProc` e namespace
     */
    static join(nfe, prot, root, versao) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<${root} versao="${versao}" xmlns="${this.urlPortal}">
${nfe}
${prot}
</${root}>`;
    }
}
Complements.urlPortal = 'http://www.portalfiscal.inf.br/nfe';
