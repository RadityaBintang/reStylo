const db = require('../config/database');

const getTops = async (category) => {
  const [rows] = await db.execute(
    'SELECT * FROM tops WHERE category = ?',
    [category]
  );
  return rows;
};

const getAllTops = async () => {
  const [rows] = await db.execute('SELECT * FROM tops ORDER BY category, name');
  return rows;
};

const getBottoms = async (category) => {
  const [rows] = await db.execute(
    'SELECT * FROM bottoms WHERE category = ?',
    [category]
  );
  return rows;
};

const getAllBottoms = async () => {
  const [rows] = await db.execute('SELECT * FROM bottoms ORDER BY category, name');
  return rows;
};

const getTopById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM tops WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const getBottomById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM bottoms WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const saveOutfit = async (name, desc, topId, bottomId) => {
  const [result] = await db.execute(
    'INSERT INTO saved_outfits (name, description, top_id, bottom_id) VALUES (?, ?, ?, ?)',
    [name, desc, topId, bottomId]
  );
  return result.affectedRows > 0;
};

const getSavedOutfits = async () => {
  const [rows] = await db.execute(`
    SELECT 
      so.id,
      so.name,
      so.description,
      so.top_id,
      so.bottom_id,
      t.id AS top_id, 
      t.name AS top_name, 
      t.image_url AS top_image_url, 
      t.category AS category,
      b.id AS bottom_id, 
      b.name AS bottom_name, 
      b.image_url AS bottom_image_url
    FROM saved_outfits so
    LEFT JOIN tops t ON so.top_id = t.id
    LEFT JOIN bottoms b ON so.bottom_id = b.id
    ORDER BY so.id DESC
  `);

  return rows.map(row => ({
    id: row.id,
    name: row.name || `Outfit ${row.category || 'Casual'}`,
    description: row.description || `Paduan ${row.top_name || 'Top'} dan ${row.bottom_name || 'Bottom'}`,
    top: {
      id: row.top_id,
      name: row.top_name,
      image_url: row.top_image_url
    },
    bottom: {
      id: row.bottom_id,
      name: row.bottom_name,
      image_url: row.bottom_image_url
    }
  }));
};

const deleteOutfit = async (id) => {
  try {
    console.log('SaveModel: Attempting to delete outfit with ID:', id);
    
    const [result] = await db.execute(
      'DELETE FROM saved_outfits WHERE id = ?',
      [id]
    );
    
    console.log('SaveModel: Delete result:', result);
    console.log('SaveModel: Affected rows:', result.affectedRows);
    
    return result.affectedRows > 0;
  } catch (err) {
    console.error('SaveModel: Error deleting outfit:', err);
    throw err;
  }
};

module.exports = {
  getTops,
  getAllTops,
  getBottoms,
  getAllBottoms,
  getTopById,
  getBottomById,
  saveOutfit,
  getSavedOutfits,
  deleteOutfit
};