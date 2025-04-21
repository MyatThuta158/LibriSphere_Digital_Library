<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PharIo\Manifest\Author;

class Resources extends Model
{
    protected $table    = 'electronic_resources';
    protected $fillable = ['code', 'name', 'ISBN', 'publish_date', 'MemberViewCount', 'cover_photo', 'file', 'author_id', 'Description', 'resource_typeId'];
    public $timestamps  = false;

    //----This is for one to many relationship connection---//
    public function author()
    {
        return $this->belongsTo(Authors::class, 'author_id');
    }

    //------This is for many to many relationship connection---//
    public function Genre()
    {
        return $this->belongsToMany(Genre::class)->withTimestamps();
    }

    public function reviews()
    {
        return $this->hasMany(Reviews::class, 'resource_id');
    }

    public function ResourceType()
    {
        return $this->belongsTo(ResourceType::class, 'resource_typeId', 'id');
    }

    public function incrementViewCount(): int
    {
        // Eloquent’s increment() defaults to +1 and issues a single SQL UPDATE … + 1
        return $this->increment('MemberViewCount');
    }
}
