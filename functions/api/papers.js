export async function onRequestGet(context) {
  const bucket = context.env.EXAM_BUCKET; // We will link this name in Step 4
  const listed = await bucket.list();
  
  const files = listed.objects.map(obj => ({
    name: obj.key,
    url: `/api/download/${obj.key}` 
  }));

  return new Response(JSON.stringify(files), {
    headers: { 'Content-Type': 'application/json' }
  });
}