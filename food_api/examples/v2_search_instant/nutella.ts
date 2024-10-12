import { $ } from "bun";
import { searchInstant } from "../../common";

(async () => {
    const query = "nutella";
    const response = await searchInstant(query);
    await $`echo ${JSON.stringify(response.data, null, 2)} > ${query}.output.json`;
})();