export class Complements {
    /**
     * Junta o XML da NF-e assinada e o protocolo de autorização da SEFAZ, formando o nfeProc.
     * @param xmlAssinado XML da NF-e já assinado (string)
     * @param xmlResposta XML da SEFAZ com <protNFe> (string)
     * @returns XML nfeProc completo
     */
    static toAuthorize(xmlAssinado, xmlResposta) {
        const protNFe = this.extractTag(xmlResposta, 'protNFe');
        const versao = this.extractVersao(xmlAssinado) || '4.00';
        return this.join(xmlAssinado, protNFe, 'nfeProc', versao);
    }
    /**
     * Junta o XML do evento (cancelamento, carta de correção, etc) com o protocolo da SEFAZ, formando o procEventoNFe.
     * @param xmlEvento XML do evento assinado (string)
     * @param xmlResposta XML da SEFAZ com <retEvento> (string)
     * @returns XML procEventoNFe completo
     */
    static toProcEvento(xmlEvento, xmlResposta) {
        const retEvento = this.extractTag(xmlResposta, 'retEvento');
        const versao = this.extractVersao(xmlEvento) || '1.00';
        return this.join(xmlEvento, retEvento, 'procEventoNFe', versao);
    }
    /**
     * Extrai a tag desejada do XML (ex: <protNFe>...</protNFe>)
     */
    static extractTag(xml, tag) {
        const match = xml.match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'm'));
        if (!match) {
            throw new Error(`Tag <${tag}> não encontrada no XML.`);
        }
        return match[0];
    }
    /**
     * Extrai a versão do XML (ex: versao="4.00" ou versao="1.00")
     */
    static extractVersao(xml) {
        const match = xml.match(/versao="([\d.]+)"/);
        return match ? match[1] : null;
    }
    /**
     * Junta dois blocos XML sob uma tag raiz com a versão e namespace corretos
     */
    static join(bloco1, bloco2, root, versao) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<${root} versao="${versao}" xmlns="${this.urlPortal}">
${bloco1}
${bloco2}
</${root}>`;
    }
}
Complements.urlPortal = 'http://www.portalfiscal.inf.br/nfe';
