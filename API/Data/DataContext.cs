using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // This uses the method inside base class DB context and passes it this builder object
        base.OnModelCreating(modelBuilder);

        // This is going to represent the primary key that's used inside this table
        modelBuilder.Entity<UserLike>().HasKey(k => new { k.SourceUserId, k.TargetUserId });

        modelBuilder.Entity<UserLike>()
        .HasOne(s => s.SourceUser)
        .WithMany(l => l.LikedUsers)
        .HasForeignKey(s => s.SourceUserId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserLike>()
        .HasOne(t => t.TargetUser)
        .WithMany(l => l.LikedByUsers)
        .HasForeignKey(t => t.TargetUserId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}
