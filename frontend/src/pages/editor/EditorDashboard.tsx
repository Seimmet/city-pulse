import { 
  FileText, PlusCircle, Clock, CheckCircle, AlertCircle, 
  Eye, Edit, Send, Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/data/mockData";

const editorStats = [
  { title: "Published", value: "23", icon: CheckCircle, color: "text-success" },
  { title: "In Review", value: "4", icon: Clock, color: "text-warning" },
  { title: "Drafts", value: "7", icon: FileText, color: "text-muted-foreground" },
];

export function EditorDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your submissions and drafts</p>
        </div>
        <Button variant="gold">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Submission
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {editorStats.map((stat) => (
          <Card key={stat.title} className="card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-3xl font-bold font-serif">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Your latest content submissions</CardDescription>
          </div>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles.map((article) => (
              <div 
                key={article.id} 
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  article.status === "published" ? "bg-success/10" :
                  article.status === "review" ? "bg-warning/10" :
                  "bg-muted"
                }`}>
                  {article.status === "published" ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : article.status === "review" ? (
                    <Clock className="w-5 h-5 text-warning" />
                  ) : (
                    <FileText className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{article.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <Badge variant="outline">{article.category}</Badge>
                  </div>
                </div>
                <Badge 
                  variant={
                    article.status === "published" ? "default" : 
                    article.status === "review" ? "secondary" : "outline"
                  }
                  className={
                    article.status === "published" ? "bg-success/10 text-success border-success/20" :
                    article.status === "review" ? "bg-warning/10 text-warning border-warning/20" : ""
                  }
                >
                  {article.status}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-hover cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                <FileText className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">Submit Article</h3>
                <p className="text-sm text-muted-foreground">Write and submit a new article</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer group">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold transition-colors">
                <Send className="w-7 h-7 text-gold group-hover:text-charcoal transition-colors" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">Submit Media</h3>
                <p className="text-sm text-muted-foreground">Upload photos or videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
