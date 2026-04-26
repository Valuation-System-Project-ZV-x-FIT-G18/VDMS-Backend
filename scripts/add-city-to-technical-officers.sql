-- Add city column to technical officers and backfill sample values.
ALTER TABLE technical_officers
ADD COLUMN IF NOT EXISTS city VARCHAR(120);

UPDATE technical_officers
SET city = CASE to_id
  WHEN 'tof001' THEN 'Colombo'
  WHEN 'tof002' THEN 'Kandy'
  WHEN 'tof003' THEN 'Galle'
  WHEN 'tof004' THEN 'Jaffna'
  WHEN 'tof005' THEN 'Kurunegala'
  WHEN 'tof006' THEN 'Matara'
  WHEN 'tof007' THEN 'Negombo'
  WHEN 'tof008' THEN 'Anuradhapura'
  WHEN 'tof009' THEN 'Kalutara'
  WHEN 'tof010' THEN 'Ratnapura'
  WHEN 'tof011' THEN 'Badulla'
  WHEN 'tof012' THEN 'Trincomalee'
  WHEN 'tof013' THEN 'Batticaloa'
  WHEN 'tof014' THEN 'Nuwara Eliya'
  WHEN 'tof015' THEN 'Kegalle'
  WHEN 'tof016' THEN 'Colombo'
  WHEN 'tof017' THEN 'Kandy'
  WHEN 'tof018' THEN 'Galle'
  WHEN 'tof019' THEN 'Kurunegala'
  WHEN 'tof020' THEN 'Jaffna'
  WHEN 'tof021' THEN 'Colombo'
  WHEN 'tof022' THEN 'Kandy'
  WHEN 'tof023' THEN 'Galle'
  WHEN 'tof024' THEN 'Jaffna'
  WHEN 'tof025' THEN 'Kurunegala'
  WHEN 'tof026' THEN 'Matara'
  WHEN 'tof027' THEN 'Negombo'
  WHEN 'tof028' THEN 'Anuradhapura'
  WHEN 'tof029' THEN 'Kalutara'
  WHEN 'tof030' THEN 'Ratnapura'
  ELSE city
END
WHERE city IS NULL;