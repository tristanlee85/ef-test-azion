import  * as cheerio  from "cheerio";

async function handleRequest(request, args) {
  const url = new URL(request.url);
  const origin = new URL("https://www.google.com");
  const originUrl = new URL(url.toString());

  originUrl.protocol = origin.protocol;
  originUrl.host = origin.host;
  originUrl.port = origin.port;

  const response = await fetch(originUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      host: "www.google.com",
    },
  });
  const headers = new Headers(response.headers);
  
  console.log(`Incoming request: ${url.toString()} -> ${originUrl.toString()}`);
  if (url.pathname === "/") {
    const bodyText = await response.text();
    const $ = cheerio.load(bodyText);
    
    $('title').text('My Custom Title');

    const modifiedBody = $.html();
    
    headers.delete("content-length");
    
    return new Response(modifiedBody, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  
  return response
}

export { handleRequest };
