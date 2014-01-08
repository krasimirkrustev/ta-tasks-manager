namespace TasksManager.Data.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using TasksManager.Models;

    public sealed class Configuration : DbMigrationsConfiguration<TasksManager.Data.TasksManagerDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }

        protected override void Seed(TasksManager.Data.TasksManagerDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            context.States.AddOrUpdate(s => s.Value,
                new State { Value = "upcomming" },
                new State { Value = "current" },
                new State { Value = "finished" });

            base.Seed(context);
        }
    }
}
