<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ResourceType extends Model
{
    protected $table    = 'resource_file_types';
    protected $fillable = ['TypeName'];

    public function Resource()
    {
        return $this->BelongsToMany(Resources::class);
    }
}
