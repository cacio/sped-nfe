export class Complements {
    private static readonly urlPortal = 'http://www.portalfiscal.inf.br/nfe';

    /**
     * Junta o XML da NF-e assinada e o protocolo de autorização da SEFAZ, formando o `nfeProc`.
     * @param xmlAssinado XML da NF-e já assinado (string)
     * @param xmlResposta XML da SEFAZ com <protNFe> (string)
     * @returns XML `nfeProc` completo
     */
    public static toAuthorize(xmlAssinado: string, xmlResposta: string): string {
        const protNFe = this.extractTag(xmlResposta, 'protNFe');
        const versao = this.extractVersao(xmlAssinado) || '4.00';

        return this.join(xmlAssinado, protNFe, 'nfeProc', versao);
    }

    /**
     * Extrai a tag desejada do XML, como <protNFe>...</protNFe>
     */
    private static extractTag(xml: string, tag: string): string {
        const match = xml.match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'm'));
        if (!match) {
            throw new Error(`Tag <${tag}> não encontrada no XML.`);
        }
        return match[0];
    }

    /**
     * Extrai a versão da NF-e do XML assinado, ex: versao="4.00"
     */
    private static extractVersao(xml: string): string | null {
        const match = xml.match(/<infNFe[^>]+versao="([\d.]+)"/);
        return match ? match[1] : null;
    }

    /**
     * Junta as partes no formato correto, com tag raiz `nfeProc` e namespace
     */
    private static join(nfe: string, prot: string, root: string, versao: string): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<${root} versao="${versao}" xmlns="${this.urlPortal}">
${nfe}
${prot}
</${root}>`;
    }
}
