import { Food } from "src/models/food-model";
import { createFood } from "src/resolvers/mutations";

describe("createFood mutation unit tests", ()=>{
  it("should be defined", () => {
    expect(createFood).toBeDefined();
  });
    it("should create a food item", async () => {
        const mockArgs = {
        name: "Pizza",
        price: 12.99,
        description: "Delicious cheese pizza",
        image: "pizza.jpg"
        };
    
        const mockFood = {
        ...mockArgs,
        _id: "12345",
        save: jest.fn().mockResolvedValue(mockArgs)
        };
    
        jest.spyOn(Food.prototype, 'save').mockResolvedValue(mockFood);
    
        const result = await createFood({}, mockArgs);
        
        expect(result).toMatchObject(mockArgs);
        expect(Food.prototype.save).toHaveBeenCalled();
    });
    it("should throw an error if food creation fails", async () => {
        const mockArgs = {
            name: "Burger",
            price: 8.99,
            description: "Juicy beef burger",
            image: "burger.jpg"
        };

        jest.spyOn(Food.prototype, 'save').mockRejectedValue(new Error("Database error"));

        await expect(createFood({}, mockArgs)).rejects.toThrow("Error creating food item: Database error");
    }
    );
})
