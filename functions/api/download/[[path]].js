export async function onRequestGet(context) {
  const bucket = context.env.EXAM_BUCKET;

  // We use 'path' here because the filename is [[path]].js
  // The join('/') fixes the slashes that get split up
  const pathArray = context.params.path; 
  // This converts "FINAL%20EXAM" back to "FINAL EXAM"
  const objectKey = decodeURIComponent(pathArray.join('/'));


  const object = await bucket.get(objectKey);

  if (!object) {
    return new Response('File not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  
  // This line makes the "Preview" work!
  headers.set('Content-Disposition', `inline; filename="${pathArray[pathArray.length - 1]}"`);

  return new Response(object.body, { headers });
}

