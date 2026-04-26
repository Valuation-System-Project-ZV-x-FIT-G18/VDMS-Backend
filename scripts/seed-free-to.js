const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'vdms_db',
  });

  await client.connect();

  await client.query(`
    INSERT INTO technical_officers
      (to_id, name, first_name, last_name, name_with_initials, email, phone, nic, dob)
    VALUES
      ('tof016', 'Ravindu Perera', 'Ravindu', 'Perera', 'R. Perera', 'ravindu@valuation.lk', '0711111117', '199212345686', '1992-02-17'),
      ('tof017', 'Kasun Fernando', 'Kasun', 'Fernando', 'K. Fernando', 'kasun@valuation.lk', '0711111118', '199512345687', '1995-05-23'),
      ('tof018', 'Dinesh Silva', 'Dinesh', 'Silva', 'D. Silva', 'dinesh@valuation.lk', '0711111119', '199012345688', '1990-10-11'),
      ('tof019', 'Nadeeka Jayasuriya', 'Nadeeka', 'Jayasuriya', 'N. Jayasuriya', 'nadeeka@valuation.lk', '0711111120', '198912345689', '1989-07-30'),
      ('tof020', 'Charith Bandara', 'Charith', 'Bandara', 'C. Bandara', 'charith@valuation.lk', '0711111121', '199312345690', '1993-12-09')
    ON CONFLICT DO NOTHING;
  `);

  await client.query(`
    INSERT INTO free (to_id)
    VALUES ('tof016'), ('tof017'), ('tof018'), ('tof019'), ('tof020')
    ON CONFLICT DO NOTHING;
  `);

  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM free');
  console.log('Free officers count:', rows[0].count);

  await client.end();
}

run().catch((error) => {
  console.error('Failed seeding free TO sample data:', error.message);
  process.exit(1);
});
