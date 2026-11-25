# Week 1 reflection
1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?
Imperative (plain JS) is giving step-by-step DOM instructions manually. Declarative (React) is just describing what you want on screen and letting React handle updating the DOM.

2. Why must a component name start with a capital letter?
So React knows it’s a custom component. Lowercase tags (<div>, <button>) are read as standard HTML elements.

3. What does a fragment <>...</> do, and why not just use a <div>?
Fragments group elements without adding extra HTML tags to the actual page. Using a <div> instead can mess up CSS layouts.

4. Name one benefit of splitting the UI into small components.
Reusability. The same component can be used in multiple places without rewriting code, and it makes finding bugs way easier.

# Week 6 reflection

1. Explain, step by step, what happens from the moment you click Place order until the new order appears on your Orders page.
When I click Place order, CheckoutForm validates the name, Mahallah, and pickup time before calling CartPage's handlePlaceOrder. The handler calls placeOrders with the signed-in user, cart, and checkout details. placeOrders groups cart lines by vendor, creates one order document per vendor in a Firestore batch, and commits the batch with serverTimestamp and status Received. CartPage clears the local cart and navigates to OrdersPage. OrdersPage's useMyOrders listener receives the new document through onSnapshot and renders it without calling setOrders because Firestore is the source of truth.

2. Why is orders a top-level collection, and why does each order copy vendorName and each item's name and price instead of storing only IDs?
The orders collection is top-level because orders belong to users and need to be queried directly by studentUid. A top-level collection also keeps order history independent from a vendor document that may change later. Copying vendorName and item details preserves the receipt as it was placed, even if a vendor renames an item or changes its price. The IDs remain useful for reference, while the copied values make the order immediately readable.

3. Your personal feature: which Firestore path and fields hold its data, and which line of your code reads it?
My personal feature is category filtering, so the category value is stored in each menu document at `vendors/{vendorId}/menu/{itemId}` under the `category` field. The live filtered query is created in `src/services/vendors.js` with `query(menuRef, where('category', '==', category))`. When “All” is selected, the query uses the full menu collection instead.

