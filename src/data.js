export const CATEGORIES = ["All", "Desk", "Kitchen", "Home"];

export const PRODUCTS = [
  { id: 1, name: "Walnut Monitor Riser", category: "Desk", price: 1890, emoji: "🪵", color: "#E9D8C4", desc: "Solid walnut shelf that lifts your screen to eye level and hides a keyboard underneath." },
  { id: 2, name: "Felt Desk Mat", category: "Desk", price: 990, emoji: "🖱️", color: "#CFE0DC", desc: "Wool-blend felt mat, 80 × 40 cm, with a non-slip rubber base." },
  { id: 3, name: "Brass Pen Cup", category: "Desk", price: 650, emoji: "✏️", color: "#F3E3A6", desc: "Weighted brass cup that keeps pens, scissors and rulers within reach." },
  { id: 4, name: "Clip-On Task Lamp", category: "Desk", price: 1450, emoji: "💡", color: "#FBE9B5", desc: "Warm LED lamp with a flexible neck and three brightness levels." },
  { id: 5, name: "Stoneware Mug", category: "Kitchen", price: 420, emoji: "☕", color: "#D8DEE9", desc: "Hand-glazed 350 ml mug. Microwave and dishwasher safe." },
  { id: 6, name: "Pour-Over Kettle", category: "Kitchen", price: 2250, emoji: "🫖", color: "#DDE7D3", desc: "Gooseneck stainless kettle for slow, steady pours." },
  { id: 7, name: "Linen Apron", category: "Kitchen", price: 780, emoji: "🧺", color: "#EAD7D7", desc: "Washed linen apron with deep front pockets and adjustable straps." },
  { id: 8, name: "Cast Iron Trivet", category: "Kitchen", price: 560, emoji: "🍳", color: "#CBD3D6", desc: "Heavy trivet that protects counters from hot pans." },
  { id: 9, name: "Soy Wax Candle", category: "Home", price: 540, emoji: "🕯️", color: "#F1DCCB", desc: "Cedar and citrus scented candle with a 40-hour burn time." },
  { id: 10, name: "Ceramic Plant Pot", category: "Home", price: 690, emoji: "🪴", color: "#D3E6D0", desc: "Matte pot with a drainage plate, sized for small indoor plants." },
  { id: 11, name: "Woven Storage Basket", category: "Home", price: 880, emoji: "🧶", color: "#EBDDBF", desc: "Hand-woven seagrass basket for blankets, toys or laundry." },
  { id: 12, name: "Wall Clock", category: "Home", price: 1320, emoji: "🕰️", color: "#D9D6EA", desc: "Silent-sweep quartz clock in a slim beech frame, 30 cm wide." },
];

export const peso = (n) => "₱" + n.toLocaleString("en-PH");
