export async function onRequestGet(context) {
  const bucket = context.env.EXAM_BUCKET;
  
  // Reconstruct the full path (e.g., "LAW240/Exam.pdf") from the URL segments
  const pathArray = context.params.path; 
  const objectKey = pathArray.join('/');

  const object = await bucket.get(objectKey);

  if (!object) {
    return new Response('File not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  
  // "inline" allows the browser to Preview the PDF instead of downloading it immediately
  headers.set('Content-Disposition', `inline; filename="${pathArray[pathArray.length - 1]}"`);

  return new Response(object.body, { headers });
}
