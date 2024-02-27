import { Card, Grid, Text } from "@radix-ui/themes";

export default function Page() {
  return (
    <Grid
      className={`grid-cols-2 gap-4`}
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <Card className={`p-4`}>
        <Text className={`text-lg font-bold`}>Total Users</Text>
        <Text className={`text-3xl font-bold mt-2`}>1,234</Text>
      </Card>
      <Card className={`p-4`}>
        <Text className={`text-lg font-bold`}>Total Sales</Text>
        <Text className={`text-3xl font-bold mt-2`}>$10,000</Text>
      </Card>
      {/* Add more cards for other dashboard metrics */}
    </Grid>
  );
}
