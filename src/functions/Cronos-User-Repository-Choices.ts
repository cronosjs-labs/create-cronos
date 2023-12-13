import autocomplete from 'inquirer-autocomplete-standalone';
import fetch from 'node-fetch';
import ora from 'ora';

interface Project {
  name: string;
  description: string;
  route: string;
  typescript: boolean;
  extra: string;
}

async function cronosUserRepository(): Promise<{
  tech: string;
  extra: string | undefined;
}> {
  let templates: Project[] = [];

  try {
    console.clear();
    const spinner = ora().start();
    spinner.color = 'cyan';
    spinner.text = '\x1b[1m\x1b[36m📡 Fetching templates...\x1b[0m';
    
    const url =
      'https://raw.githubusercontent.com/cronos-js/Cronos-User-Repository/main/dictionary.json';

    const response = await fetch(url);

    spinner.stop();

    const data = await response.text();

    const dataJSON = JSON.parse(data);

    templates = dataJSON;

    console.clear();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const filter = (input: string, value: string) => {
    return input.includes(value);
  };

  const answer = await autocomplete({
    message: '💻 Select a technology:',
    source: async (input) => {
      const filteredCountries = templates.filter((template) => {
        if (!input) return true;
        const inputLowerCase = input.toLowerCase();
        const countryLowerCase = template.name.toLowerCase();
        return filter(countryLowerCase, inputLowerCase);
      });

      return filteredCountries.map((template) => {
        return {
          value: template.route,
          name: template.name,
          description: `${template.description}`
        };
      });
    }
  });

  const filterTemplate = templates.find((template) => template.route === answer);

  const extra = filterTemplate?.extra;

  return { tech: answer, extra };
}

export { cronosUserRepository };
