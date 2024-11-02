import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CategoryTab() {
  return (
    <>
      <Tabs defaultValue="source">
        <TabsList>
          <TabsTrigger value="source">音源</TabsTrigger>
          <TabsTrigger value="password">映像</TabsTrigger>
          <TabsTrigger value="other">その他</TabsTrigger>
        </TabsList>
        <TabsContent value="source">ここに音源のスレッドが入ります</TabsContent>
        <TabsContent value="password">
          ここに映像のスレッドが入ります。
        </TabsContent>
        <TabsContent value="other">
          ここにその他のスレッドが入ります。
        </TabsContent>
      </Tabs>
    </>
  );
}
