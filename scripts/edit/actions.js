export const AEM_ORIGIN = 'https://admin.hlx.page';
export const DA_ORIGIN = 'https://admin.da.live';

/**
 * Trigger an AEM-side action (e.g., preview/publish) for the given DA path.
 */
export async function saveToAem(path, action) {
  const [owner, repo, ...parts] = path.slice(1).toLowerCase().split('/');
  const aemPath = parts.join('/');
  const url = `${AEM_ORIGIN}/${action}/${owner}/${repo}/main/${aemPath}`;
  const resp = await fetch(url, { method: 'POST' });
  if (!resp.ok) {
    const { status } = resp;
    const message = [401, 403].some((s) => s === status)
      ? 'Not authorized to'
      : 'Error during';
    return { error: { status, type: 'error', message } };
  }
  return resp.json();
}

/**
 * Handles saving the updated source HTML to the admin endpoint.
 * - Retrieves the latest source HTML from the mapper.
 * - Shows a saving indicator on the save button.
 * - Sends the HTML as a FormData blob to the admin endpoint.
 * - Handles success/failure and resets the save button state.
 */
export async function saveToDA(path, html) {
  const [owner, repo, ...parts] = path.slice(1).toLowerCase().split('/');
  const pagePath = parts.join('/');

  const blob = new Blob([html], { type: 'text/html' });
  const body = new FormData();
  body.append('data', blob);
  const opts = {
    method: 'POST',
    body,
  };

  const fullpath = `${DA_ORIGIN}/source/${owner}/${repo}${pagePath}.html`;
  const resp = await fetch(fullpath, opts);
  if (resp.status === 200 || resp.status === 201) {
    return { success: true };
  } else {
    return { success: false };
  }
}
