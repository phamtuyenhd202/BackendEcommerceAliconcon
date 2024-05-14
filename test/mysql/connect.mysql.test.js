const mysql =  require('mysql2')

//create connection to pool server
const pool = mysql.createPool({
    host: '127.0.0.1',
    port: '8811',
    user: 'root',
    password: 'tipjs',
    database: 'test'
})

const batchSize = 100000;  //adjust batch size
const totalSize= 1_000_000; // adjust total size

let currentID = 1
console.time('::::::::::TIMER:::::::::::')
const insertBatch = async () =>{
    const values = [];
    for (let i = 0; i < batchSize && currentID <= totalSize; i++) {
        const name = `name-${currentID}`
        const age= currentID
        const address = `address-${currentID}`
        values.push([currentID, name , age, address])
        currentID++;
    }
    
    if(!values.length){
        console.timeEnd('::::::::::TIMER:::::::::::')
        pool.end(err =>{
            if(err){
                console.log('error occurred wile running batch')
            }else{
                console.log('connect pool closed successfuly')
            }
        })
        return;
    }
    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`

    pool.query(sql, [values], async function(err, result){
        if(err) throw err
        console.log(`Inserted ${result.affectedRows} records`);
        await insertBatch()
    })

}

insertBatch().catch(console.error)