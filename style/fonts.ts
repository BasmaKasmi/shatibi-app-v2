import localFont from "next/font/local";

export const poppins = localFont({
  src: [
    {
      path: "./Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Poppins-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Poppins-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "./Poppins-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Poppins-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
  ],
});
