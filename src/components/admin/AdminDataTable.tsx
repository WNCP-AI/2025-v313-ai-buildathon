import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionButton } from "@/components/shared/ActionButton";
import { StandardCard, CardContent, CardHeader, CardTitle } from "@/components/shared/StandardCard";
import { LoadingGrid } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import StatsCard from "@/components/StatsCard";
import { Trash2, Users, List, Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminDataTableProps {
  type: 'users' | 'listings';
  data: any[];
  selectedItems: string[];
  onToggleItem: (id: string) => void;
  onToggleAll: () => void;
  onDelete: (id: string) => void;
  onBulkDelete: () => void;
  isLoading?: boolean;
  loadingBulkDelete?: boolean;
}

export const AdminDataTable = ({
  type,
  data,
  selectedItems,
  onToggleItem,
  onToggleAll,
  onDelete,
  onBulkDelete,
  isLoading = false,
  loadingBulkDelete = false,
}: AdminDataTableProps) => {
  const navigate = useNavigate();
  const isUsers = type === 'users';
  const title = isUsers ? 'Users' : 'Listings';
  const Icon = isUsers ? Users : List;

  if (isLoading) {
    return <LoadingGrid variant="table" />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Icon}
        title={`No ${title.toLowerCase()} found`}
        description={`Create your first ${isUsers ? 'user' : 'listing'} to get started.`}
      />
    );
  }

  const handleEdit = (item: any) => {
    if (isUsers) {
      navigate(`/admin-edit-user/${item.id}`);
    } else {
      navigate(`/admin-edit-listing/${item.id}`);
    }
  };

   const handleView = (item: any) => {
     if (isUsers) {
       navigate(`/profile/${item.profiles?.user_id || item.id}`);
     } else {
       navigate(`/listing/${item.id}`);
     }
   };
  return (
    <StandardCard variant="admin">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        
        <StatsCard
          title={`Selected ${title}`}
          value={`${selectedItems.length}/${data.length}`}
          icon={Icon}
          loading={false}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <ActionButton
              icon={Trash2}
              label={`Delete ${selectedItems.length} ${title.toLowerCase()}`}
              action="delete"
              onClick={onBulkDelete}
              loading={loadingBulkDelete}
              requiresConfirmation
              confirmTitle={`Delete ${selectedItems.length} ${title.toLowerCase()}?`}
              confirmDescription="This action cannot be undone."
            />
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === data.length}
                    onCheckedChange={onToggleAll}
                  />
                </TableHead>
                {isUsers ? (
                  <>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>AI Generated</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </>
                )}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => onToggleItem(item.id)}
                    />
                  </TableCell>
                   {isUsers ? (
                     <>
                       <TableCell>
                         {item.profiles?.avatar_url ? (
                           <img
                             src={item.profiles.avatar_url}
                             alt={item.profiles.full_name || 'User avatar'}
                             className="w-12 h-12 object-cover rounded-full border border-border"
                           />
                         ) : (
                           <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center border border-border">
                             <span className="text-xs text-muted-foreground font-semibold">
                               {(item.profiles?.full_name?.charAt(0) || item.email?.charAt(0) || '?').toUpperCase()}
                             </span>
                           </div>
                         )}
                       </TableCell>
                       <TableCell className="font-medium">{item.profiles?.full_name || '—'}</TableCell>
                       <TableCell>{item.email || '—'}</TableCell>
                       <TableCell>
                         {item.profiles?.role ? (
                           <Badge variant={item.profiles.role === 'operator' ? 'default' : 'secondary'}>
                             {item.profiles.role}
                           </Badge>
                         ) : (
                           <span className="text-muted-foreground">—</span>
                         )}
                       </TableCell>
                       <TableCell>{item.profiles?.phone || '—'}</TableCell>
                       <TableCell>
                         {item.profiles?.is_ai_generated && (
                           <Badge variant="outline">AI Generated</Badge>
                         )}
                       </TableCell>
                     </>
                   ) : (
                     <>
                       <TableCell>
                         {item.image_url ? (
                           <img
                             src={item.image_url}
                             alt={item.title}
                             className="w-12 h-12 object-cover rounded-lg border border-border"
                           />
                         ) : (
                           <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center border border-border">
                             <span className="text-xs text-muted-foreground">No image</span>
                           </div>
                         )}
                       </TableCell>
                       <TableCell className="font-medium">{item.title}</TableCell>
                       <TableCell>{item.operator_name}</TableCell>
                       <TableCell>
                         <Badge variant="secondary">{item.category}</Badge>
                       </TableCell>
                       <TableCell>${item.price}</TableCell>
                       <TableCell>
                         <Badge variant={item.is_active ? 'default' : 'secondary'}>
                           {item.is_active ? 'Active' : 'Inactive'}
                         </Badge>
                       </TableCell>
                     </>
                   )}
                  <TableCell className="text-right space-x-1">
                    <ActionButton
                      icon={Eye}
                      label="View"
                      action="view"
                      size="sm"
                      onClick={() => handleView(item)}
                    />
                    <ActionButton
                      icon={Edit}
                      label="Edit"
                      action="edit"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    />
                    <ActionButton
                      icon={Trash2}
                      label="Delete"
                      action="delete"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      requiresConfirmation
                      confirmTitle={`Delete ${isUsers ? 'user' : 'listing'}?`}
                      confirmDescription="This action cannot be undone."
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {data.map((item) => (
            <StandardCard key={item.id} variant="interactive">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => onToggleItem(item.id)}
                    />
                     {isUsers ? (
                       item.profiles?.avatar_url ? (
                         <img
                           src={item.profiles.avatar_url}
                           alt={item.profiles.full_name || 'User avatar'}
                           className="w-10 h-10 object-cover rounded-full border border-border flex-shrink-0"
                         />
                       ) : (
                         <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center border border-border flex-shrink-0">
                           <span className="text-xs text-muted-foreground font-semibold">
                             {(item.profiles?.full_name?.charAt(0) || item.email?.charAt(0) || '?').toUpperCase()}
                           </span>
                         </div>
                       )
                     ) : (
                       item.image_url && (
                         <img
                           src={item.image_url}
                           alt={item.title}
                           className="w-10 h-10 object-cover rounded-lg border border-border flex-shrink-0"
                         />
                       )
                     )}
                     <div>
                       <h3 className="font-semibold text-sm">
                         {isUsers ? (item.profiles?.full_name || '—') : item.title}
                       </h3>
                       <p className="text-xs text-muted-foreground">
                         {isUsers ? (item.email || '—') : item.operator_name}
                       </p>
                     </div>
                  </div>
                  <div className="flex gap-1">
                    <ActionButton
                      icon={Eye}
                      label="View"
                      action="view"
                      size="sm"
                      onClick={() => handleView(item)}
                    />
                    <ActionButton
                      icon={Edit}
                      label="Edit"
                      action="edit"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    />
                    <ActionButton
                      icon={Trash2}
                      label="Delete"
                      action="delete"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      requiresConfirmation
                      confirmTitle={`Delete ${isUsers ? 'user' : 'listing'}?`}
                      confirmDescription="This action cannot be undone."
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {isUsers ? (
                    <>
                      <Badge variant={item.role === 'operator' ? 'default' : 'secondary'} className="text-xs">
                        {item.role}
                      </Badge>
                      {item.is_ai_generated && (
                        <Badge variant="outline" className="text-xs">AI Generated</Badge>
                      )}
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                      <Badge variant={item.is_active ? 'default' : 'secondary'} className="text-xs">
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm font-semibold">${item.price}</span>
                    </>
                  )}
                </div>
              </CardContent>
            </StandardCard>
          ))}
        </div>
      </CardContent>
    </StandardCard>
  );
};