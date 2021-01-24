import { Product } from "../../src/models";

describe("Product DB model tests", () => {
  const values = { id: 0, name: "test product", price: 100 };

  it("should create new product", async () => {
    const product = new Product(values.name, values.price);
    await product.create();
    expect(product.id).toBeTruthy();
    values.id = product.id || 0;
  });

  it("should return all products", async () => {
    const products = await Product.getAll();
    expect(products?.length).toBeGreaterThan(0);
  });

  it("should return product", async () => {
    const product = await Product.getById(values.id);
    expect(product).toBeInstanceOf(Product);
    expect(product?.getObject()).toEqual(values);
  });

  it("should update product", async () => {
    const product = await Product.getById(values.id);
    if (!product) return;
    product.name = "new test product";
    await product.update();
    expect(product.name).toBe("new test product");
    values.name = product.name;
  });

  it("should delete product", async () => {
    let product = await Product.getById(values.id);
    if (!product) return;
    await product.delete();
    product = await Product.getById(values.id);
    expect(product).toBeFalsy();
  });
});
