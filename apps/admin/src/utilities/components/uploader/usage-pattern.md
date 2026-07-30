Here are the usage patterns:

1. Simple (uncontrolled, outside form):
   import Uploader from '@/utilities/components/uploader/uploader.index'

<Uploader />
// or with custom label/file type:
<Uploader label='Upload poster' fileType='image' />

2. Controlled (access uploaded files/IDs from parent):
   const [files, setFiles] = useState<UploadType[]>([])

<Uploader
  value={files}
  onChange={setFiles}
  fileType='image'
/>

// Access IDs:
console.log(files.map(f => f.id)) // [1, 5, 12]

3. Edit form (pre-populated from upload IDs):
   // Component fetches uploads by IDs and displays them
   <Uploader
   defaultUploadIds={[1, 5, 12]}
   onChange={(files) => console.log(files)}
   fileType='image'
   />

4. Inside a form — single file (default):
   const [poster, setPoster] = useState<UploadType[]>([])

<Uploader
  label='Poster'
  fileType='image'
  value={poster}
  onChange={setPoster}
/>
// poster[0]?.id → upload ID to send with form 5. Inside a form — multiple files:
const [stills, setStills] = useState<UploadType[]>([])

<Uploader
  label='Stills'
  fileType='image'
  multiple
  maxFiles={5}
  value={stills}
  onChange={setStills}
/>
// stills.map(f => f.id) → [2, 7, 13] → send array of IDs with form 6. Form submit example:
const handleSubmit = () => {
const payload = {
title: 'Movie Title',
poster_id: poster[0]?.id,
still_ids: stills.map(f => f.id),
trailer_id: trailer[0]?.id,
}
// POST payload to API ...
}
Key points:

- value + onChange gives you full control — files array contains { id, path, file_name, mime_type, size, source_type, ... }
- In uncontrolled mode (no value), access files via onChange
- fileType accepts 'image' | 'video' | ['image', 'video']
- defaultUploadIds fetches upload metadata from the new GET /upload/admin/:id endpoint
