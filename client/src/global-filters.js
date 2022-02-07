export const globalFilters = {
  strip_html(str) {
    if ((str === null) || (str === '') || str === undefined) {
      return '';
    }
    else {
      str = str.toString();
      return str.replace(/<[^>]*>/g, '').trim();
    }
  },

  truncatedSubject(subject, maxLength) {
    if (typeof subject !== "string") return '';

    //truncate subject if it exceeds the given maxLength
    if (subject.length > maxLength) {
      return subject.slice(0, maxLength) + " ...";
    }
    return subject;
  },

  parseAttachments(decodedAttachments) {
    let attachmentHTML = "";
    for (let attachment of decodedAttachments) {
      if (attachment.attachment_data.data.length > 0) {
        let dataBase64Rep = attachment.attachment_data.data.replace(/-/g, '+').replace(/_/g, '/');
        let urlBlob = this.b64toBlob(dataBase64Rep, attachment.mimeType, attachment.attachment_data.size);

        attachmentHTML += `<a href="` + urlBlob + `" download="` + attachment.filename + `"> <div style="margin-top: 0.5rem; padding: 0.3rem; border: 1px solid #ccc; cursor: pointer;">
                    `+ attachment.filename + `
                    </div></a>`
        //URL.revokeObjectURL(urlBlob)
      }
    }

    return attachmentHTML;
  },

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || ''
    sliceSize = sliceSize || 512

    var byteCharacters = atob(b64Data)
    var byteArrays = []

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize)

      var byteNumbers = new Array(slice.length)
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      var byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)

    }
    var blob = new Blob(byteArrays, { type: contentType })
    let urlBlob = URL.createObjectURL(blob)
    return urlBlob
  },
}