import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
	{
		address: { type: String, required: true },
		id: { type: String, required: true },
		units: { type: Number, required: true },
		number_units_stabilized: { type: Number, default: 0 },
		number_units_unstabilized: { type: Number, default: 0 },
		purchase_price: { type: String, required: true },
		down_payment_reserves: { type: String, required: true },
		unstabilized_projected_income: { type: String, required: true },
		current_realized_income: { type: String, required: true },
		sale_price: { type: String, default: "" },
		gross_profit: { type: String, default: "" },
		estimated_value: { type: String, default: "" },
		rent_increase_percent: { type: String, required: true },
		refinance_valuation: { type: String, default: "" },
		purchase_date: { type: String, required: true },
		sale_or_refinance_date: { type: String, default: null },
		major_capital_event: { type: Boolean, required: true },
		estimated_irr: { type: String, default: "" },
	},
	{ timestamps: true, collection: "properties" }
);

export default mongoose.model("Property", PropertySchema);
