export async function onRequestGet(context) {
  const fileName = context.params.filename;
  const bucket = context.env.EXAM_BUCKET;
  const object = await bucket.get(fileName);

  if (!object) return new Response('Not found', { status: 404 });

  return new Response(object.body, {
    headers: { 'Content-Type': object.httpMetadata.contentType || 'application/pdf' }
  });
}