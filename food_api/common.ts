import axios from "axios";

const api_key = "1305f974dccff2eb8a0733f814abc072";
const app_id = "b2047dea";

export async function naturalNutrients(query: string) {
    return await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        query,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': app_id,
          'x-app-key': api_key
        }
      });
}