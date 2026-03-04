import { create } from "@storybook/theming/create";
import { addons } from "@storybook/manager-api";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "CloudHub",
    brandUrl: "https://cloudhub.com/",
    barSelectedColor: "#184286"
  })
});
