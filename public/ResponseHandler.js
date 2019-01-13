export function handleResponse(vis, response) {
  console.log(vis)
  console.log(response)
  return {
    visData: vis,
    response: response
  };
}