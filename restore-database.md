## How to restore mongo database
1. Start mongodb
2. Open terminal/cmd (ctrl+`) then
> mongorestore dbdump

## FYI how to dump database (create backup database)
> mongodump -d=<database-name> -o=<routput-folder-elative-path>
For example when I create this project's dbdump I wrote
> mongodump -d=tk-hotgirls -o=dbdump