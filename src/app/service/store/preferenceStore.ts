import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Preference } from "@/app/service/model/preference/preference";

const paymentStore = create<Preference>()(
  devtools(
    persist(
      (set, get) => ({
        id: 0,
        uid: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        contacts: {
          email: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          phone: "",
        },
        dataAnalytics: {
          location: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [0, 0],
            },
          },
          budget: 0,
          rating: 0,
          willingnessToTravel: false,
        },
      }),
      { name: "preference-storage" }
    )
  )
);

export default paymentStore;
