# ServTec website

The editable website is in `dist/`: plain HTML, CSS and JavaScript, with no build step. Keep changes in this Git checkout. Serve only `dist/`.

Run `node preview.cjs` to preview at http://127.0.0.1:4175/. Stop any older server using that port first, or set PORT to another local port.

The homepage features three illustrative motorcycles; the fleet page contains seven. Models, photos, example prices and periods remain unconfirmed ServTec content. The five rental steps are provisional. Replace reference content with owner-approved material before wider publication. The enquiry form prepares an email draft; it does not send messages.

Vercel uses `vercel.json`, outputDirectory `dist`, and no build command. The connected project uses main for Production. Preview branches are subject to Vercel Authentication as verified on 16 November 2026. Do not merge this review branch into main without approval. Local Vercel credentials and project links must not be committed.

Private owner-review notes, work scripts, screenshots and credentials stay outside the repository/deployment. Existing `docs/` and `content/` are historical material and excluded from deployment. Older verification scripts may describe earlier versions; see VERIFICATION.md for checks run on this backup.
