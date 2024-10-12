import { $ } from "bun";
import { naturalNutrients } from "../../common";

(async () => {
    const query = "banana";
    const response = await naturalNutrients(query);
    await $`echo ${JSON.stringify(response.data, null, 2)} > ${query}.output.json`;
})();