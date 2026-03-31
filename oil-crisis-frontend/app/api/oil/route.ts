export async function GET() {
  const res = await fetch("http://go-service:8080/oil-price");
//   const res = await fetch("http://localhost:8080/oil-price");
  const data = await res.json();
  return Response.json(data);
}