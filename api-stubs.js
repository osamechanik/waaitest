
// WAINEX API Stubs — to be replaced with real HTTP calls
export async function apSearchPart(query) {
  await new Promise(r => setTimeout(r, 200));
  return [{supplier:'Auto Partner', code:'AP-'+Math.floor(Math.random()*10000), name:query, price: 99+Math.floor(Math.random()*200)}];
}
export async function mekoSearchPart(query) {
  await new Promise(r => setTimeout(r, 220));
  return [{supplier:'MekoNomen', code:'MEK-'+Math.floor(Math.random()*10000), name:query, price: 95+Math.floor(Math.random()*200)}];
}
export async function motowarsztatAddOrder(order) {
  await new Promise(r => setTimeout(r, 180));
  return { ok:true, id: order.id || 'MW-' + Date.now() };
}
