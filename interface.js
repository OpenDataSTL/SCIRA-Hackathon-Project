var pg = require("pg");

var db = new pg.Pool({

    user: '',

    host: '',

    database: '',

    password: '',

    port: 5432,

  });



db.query(`SELECT json_build_object(
  'type',       'Feature',
  'id',         r.ogc_fid,
  'geometry',   ST_AsGeoJSON(ST_INTERSECTION(r.wkb_geometry,fp.wkb_geometry))::json,
  'properties', json_build_object(
      'fullname', r.streetname,
      'zone_subty', fp.zone_subty
   )
)
FROM floodplain fp JOIN roads r ON (ST_Within(r.wkb_geometry, fp.wkb_geometry))
WHERE fp.zone_subty in ('FLOODWAY', '0.2 PCT ANNUAL CHANCE FLOOD HAZARD', 'AREA WITH REDUCED FLOOD RISK DUE TO LEVEE')`, (err, res) => {

    if (err) {

      console.log(err.stack)

    } else {

      console.log(res.rows[0])

    }

  })
// Flood
  db.query(`SELECT json_build_object(
    'type',       'Feature',
    'id',         fp.ogc_fid,
    'geometry',   ST_AsGeoJSON(fp.wkb_geometry)::json,
    'properties', json_build_object(
        'zone_subty', fp.zone_subty
     )
 )
FROM floodplain fp 
WHERE fp.zone_subty in ('FLOODWAY', '0.2 PCT ANNUAL CHANCE FLOOD HAZARD', 'AREA WITH REDUCED FLOOD RISK DUE TO LEVEE')`, (err, res) => {
  
      if (err) {
  
        console.log(err.stack)
  
      } else {
  
        console.log(res.rows[0])
  
      }
  
    })
//Roads
    db.query(`SELECT json_build_object(
      'type',       'Feature',
      'id',         r.ogc_fid,
      'geometry',   ST_AsGeoJSON(r.wkb_geometry)::json,
      'properties', json_build_object(
          'fullname', r.streetname
       )
   )
  FROM roads r `, (err, res) => {
    
        if (err) {
    
          console.log(err.stack)
    
        } else {
    
          console.log(res.rows[0])
    
        }
    
      })


  db.end();