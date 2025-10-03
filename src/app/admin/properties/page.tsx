import { PlusCircle } from "lucide-react";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { properties } from "@/lib/properties";
import { PropertiesClient } from "./components/client-page";

export default function AdminPropertiesPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="#">
              Export
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/properties/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Properties</CardTitle>
            <CardDescription>
              Manage your properties and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PropertiesClient data={properties} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
