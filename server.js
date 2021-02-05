const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'Frank480%',
    database: 'top_songsDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as id ${connection.threadId}`);
    songQuery();
});

songQuery = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'queryType',
            message: 'What query would you like to ask?',
            choices: ['Return data for all songs sung by a specific artist', 'Return data for artists who appear more than five times', 'Return all data for the top 100 songs', 'Return data for a specific song']
        }
    ]).then((response) => {
        if (response.queryType === 'Return data for all songs sung by a specific artist') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'artist',
                    message: 'Which artist would you like to return data for?',
                }
            ]).then((response) => {
                connection.query(`SELECT * FROM top5000 WHERE artist = '${response.artist}'`, (err, res) => {
                    if (err) throw err;
                    console.log(res);
                    connection.end();
                })
            })
        } else if (response.queryType === 'Return data for artists who appear more than five times') {
            connection.query(`SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 5`, (err, res) => {
                if (err) throw err;
                console.log(res);
                connection.end();
            })
        } else if (response.queryType === 'Return all data for the top 100 songs') {
            connection.query(`SELECT * FROM top5000 WHERE ranking > 0 AND ranking < 101`, (err, res) => {
                if (err) throw err;
                console.log(res);
                connection.end();
            })
        } else if (response.queryType === 'Return data for a specific song') {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'songName',
                    message: 'Which song would you like to return data for?',
                }
            ]).then((response) => {
                connection.query(`SELECT * FROM top5000 WHERE songTitle = '${response.songName}'`, (err, res) => {
                    if (err) throw err;
                    console.log(res);
                    connection.end();
                })
            })
        }
    })
}