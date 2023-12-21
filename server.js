import http from 'http';
import fs from 'fs/promises';

const makeServer = (usersById) => http.createServer((request, response) => {
  request.on('end', () => {
    if (request.url === '/') {
      const messages = [
        'Welcome to The Phonebook',
        `Records count: ${Object.keys(usersById).length}`,
      ];
      response.end(messages.join('\n'));
    } else if (request.url.startsWith('/search')) {
      // BEGIN (write your solution here)
      const queryParams = new URLSearchParams(request.url.split('?')[1] || '')
      const searchString = queryParams.get('q');
      const regex = new RegExp(searchString, 'i'); // 'i' flag for case-insensitive search
      const responseLines = Object.entries(usersById)
        .filter(([_, entry]) => regex.test(entry.name)) // Keep only entries where the name matches the regex
        .map(([_, entry]) => `${entry.name}, ${entry.phone}`);
      let responseStr = responseLines.join('\n');
      response.write(responseStr)
      response.end()
      // END
    }
  });

  request.resume();
});

const startServer = async (port, callback = () => {}) => {
    const data = await fs.readFile('phonebook.txt', 'utf-8');
  
    // BEGIN (write your solution here)
    const lines = data.trim().split('\n');
    const phoneBook = {};
    const usersById = lines.reduce((acc, line) => {
      const parsedLine = line.split('|').map((word) => word.trim());
      acc[parsedLine[0]] = { name: parsedLine[1], phone: parsedLine[2] };
      return acc;
    }, phoneBook);
  
    // END
  
    const server = makeServer(usersById);
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      callback(server);
    });
  };
  
startServer(8080)