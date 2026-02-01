export async function onRequestGet(context) {
  const bucket = context.env.EXAM_BUCKET;
  
  // Get the current folder "prefix" from the URL (e.g., ?prefix=LAW240/)
  const url = new URL(context.request.url);
  const prefix = url.searchParams.get('prefix') || '';

  // Ask R2 to group files by folders using '/'
  const listed = await bucket.list({
    prefix: prefix,
    delimiter: '/', 
    limit: 100
  });

  // 1. Process Folders (R2 calls them "delimitedPrefixes")
  const folders = listed.delimitedPrefixes.map(folderName => ({
    name: folderName, 
    type: 'folder'
  }));

  // 2. Process Files
  const files = listed.objects
    // Filter out the folder placeholder itself (e.g. "LAW240/") to avoid duplicates
    .filter(obj => obj.key !== prefix) 
    .map(obj => ({
      name: obj.key.replace(prefix, ''), // Show only filename, not full path
      fullPath: obj.key,
      size: obj.size,
      type: 'file'
    }));

  return new Response(JSON.stringify([...folders, ...files]), {
    headers: { 'Content-Type': 'application/json' }
  });
}
