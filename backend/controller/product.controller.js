export const getUserById = async (request, response) => {
  // /api/products/1

  const { id } = request.params;
  const query = `select * from products where product_id=$1`;
  const result = await pool.query(query, [id]);
  return response.json({
    message: "fecthed",
    data: result.rows,
    status: true,
  });
};
