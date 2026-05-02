export const categories = [
  {
    name: "New Launches",
    items: [
      {
        id: 101,
        name: "Mango Cream Bento Cake",
        description: "A soft mini celebration cake with fresh mango cream.",
        price: 499,
        type: "veg",
        image: "/cakes/mango-bento.jpg",
        images: ["/cakes/mango-bento.jpg"],
        video: "",
        tags: ["New Launch"],
      },
      {
        id: 102,
        name: "Chocolate Cupcake Box",
        description: "Assorted chocolate cupcakes packed for gifting.",
        price: 399,
        type: "veg",
        image: "/cakes/cupcake-box.jpg",
        images: ["/cakes/cupcake-box.jpg"],
        video: "",
        tags: ["New Launch", "Popular"],
      },
    ],
  },

  {
    name: "Cakes",
    items: [
      {
        id: 1,
        name: "Chocolate Truffle Cake",
        description: "Rich chocolate sponge layered with smooth truffle cream.",
        price: 650,
        type: "veg",
        image: "/cakes/chocolate-cake-1.jpg",
        images: [
          "/cakes/chocolate-cake-1.jpg",
          "/cakes/chocolate-cake-2.jpg",
          "/cakes/chocolate-cake-3.jpg",
        ],
        video: "/cakes/chocolate-cake-video.mp4",
        tags: ["Best Seller"],
      },
    ],
  },

  {
    name: "Pastries",
    items: [
      {
        id: 2,
        name: "Strawberry Cream Pastry",
        description: "Light sponge pastry topped with strawberry cream.",
        price: 140,
        type: "veg",
        image: "/cakes/strawberry-pastry.jpg",
        images: ["/cakes/strawberry-pastry.jpg"],
        video: "",
        tags: ["Popular"],
      },
    ],
  },

  {
    name: "Brownies",
    items: [
      {
        id: 3,
        name: "Fudge Brownie Box",
        description: "Dense chocolate brownies packed for gifting.",
        price: 350,
        type: "veg",
        image: "/cakes/brownie-box.jpg",
        images: ["/cakes/brownie-box.jpg"],
        video: "",
        tags: [],
      },
    ],
  },
];

export const newLaunches =
  categories.find((category) => category.name === "New Launches")?.items || [];