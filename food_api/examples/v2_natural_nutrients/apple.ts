import { $ } from "bun";
import { naturalNutrients } from "../../common";

(async () => {
    const response = await naturalNutrients("apple");
    await $`echo ${JSON.stringify(response.data, null, 2)} > apple.output.json`;
})();