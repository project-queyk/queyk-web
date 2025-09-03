"use client";

import Image from "next/image";
import { useState } from "react";
import { Session } from "next-auth";
import { Bell, BellOff, MoreHorizontal, UserCheck } from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";

import { User, UsersResponse } from "@/lib/types/users";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UserManagementPage({ session }: { session: Session }) {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setDeletingUserId(null);
  };

  const toggleNotification = useMutation({
    mutationFn: async ({
      userId,
      currentValue,
    }: {
      userId: string;
      currentValue: boolean;
    }) => {
      const response = await fetch(`/api/users/${userId}/notification`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alertNotification: !currentValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to update notification preference",
        );
      }

      return response.json();
    },
  });

  const handleDeleteUser = async (user: User) => {
    if (deletingUserId) {
      return;
    }

    setDeletingUserId(user.id);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      setUserToDelete(null);

      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["users"],
        });
        setDeletingUserId(null);
      }, 100);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete user");
      setUserToDelete(null);
      setDeletingUserId(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "user",
      header: "User",
      cell: ({ row }) => {
        const profileImage = row.original.profileImage;
        const name = row.original.name;
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 overflow-hidden rounded-full">
              <Image
                src={profileImage || "/placeholder-avatar.svg"}
                alt={`${name}'s profile`}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const displayRole = role.charAt(0).toUpperCase() + role.slice(1);
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              role === "admin"
                ? ""
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
            style={
              role === "admin"
                ? {
                    backgroundColor: "#ffd43b",
                    color: "#000000",
                  }
                : undefined
            }
          >
            {displayRole}
          </span>
        );
      },
    },
    {
      accessorKey: "alertNotification",
      header: "Alert Notifications",
      cell: ({ row }) => {
        const enabled = row.getValue("alertNotification") as boolean;
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              enabled
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const user = row.original;
        const currentUserEmail = session?.user?.email;

        if (user.email === currentUserEmail) {
          return null;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                style={{
                  position: "relative",
                  zIndex: 10,
                  pointerEvents: "auto",
                }}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const newRole = user.role === "admin" ? "user" : "admin";

                    const queryKey = [
                      "users",
                      pagination.pageIndex + 1,
                      pagination.pageSize,
                      globalFilter,
                    ];

                    queryClient.setQueryData(
                      queryKey,
                      (oldData: UsersResponse | undefined) => {
                        if (!oldData) return oldData;

                        return {
                          ...oldData,
                          data: oldData.data.map((u) =>
                            u.id === user.id ? { ...u, role: newRole } : u,
                          ),
                        };
                      },
                    );

                    const response = await fetch(`/api/users/${user.id}/role`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        role: newRole,
                      }),
                    });

                    if (!response.ok) {
                      const errorData = await response.json();

                      queryClient.invalidateQueries({ queryKey });

                      throw new Error(
                        errorData.error || "Failed to update user role",
                      );
                    }
                  } catch (error) {
                    alert(
                      error instanceof Error
                        ? error.message
                        : "Failed to update user role",
                    );
                  }
                }}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Switch to {user.role === "admin" ? "User" : "Admin"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const newNotificationValue = !user.alertNotification;

                    const queryKey = [
                      "users",
                      pagination.pageIndex + 1,
                      pagination.pageSize,
                      globalFilter,
                    ];

                    queryClient.setQueryData(
                      queryKey,
                      (oldData: UsersResponse | undefined) => {
                        if (!oldData) return oldData;

                        return {
                          ...oldData,
                          data: oldData.data.map((u) =>
                            u.id === user.id
                              ? {
                                  ...u,
                                  alertNotification: newNotificationValue,
                                }
                              : u,
                          ),
                        };
                      },
                    );

                    toggleNotification.mutate(
                      {
                        userId: user.id,
                        currentValue: user.alertNotification,
                      },
                      {
                        onError: () => {
                          queryClient.invalidateQueries({ queryKey });
                        },
                      },
                    );
                  } catch (error) {
                    alert(
                      error instanceof Error
                        ? error.message
                        : "Failed to update notification preference",
                    );
                  }
                }}
              >
                {user.alertNotification ? (
                  <Bell className="mr-2 h-4 w-4" />
                ) : (
                  <BellOff className="mr-2 h-4 w-4" />
                )}
                {user.alertNotification ? "Disable" : "Enable"} Notifications
              </DropdownMenuItem>
              {/* <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setUserToDelete(user);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete user
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const { data, isLoading, error } = useQuery<UsersResponse>({
    queryKey: [
      "users",
      pagination.pageIndex + 1,
      pagination.pageSize,
      globalFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        pageSize: pagination.pageSize.toString(),
        ...(globalFilter && { name: globalFilter }),
      });

      const response = await fetch(`/api/users?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    },
  });

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.pagination.totalPages ?? -1,
    state: {
      pagination,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
  });

  const canPreviousPage = pagination.pageIndex > 0;
  const canNextPage = data?.pagination ? data.pagination.hasNextPage : false;

  if (error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-destructive">Error loading users</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search users by name..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card className="w-full">
        <CardContent className="px-6 py-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : header.column.columnDef.header
                          ? typeof header.column.columnDef.header === "function"
                            ? header.column.columnDef.header(
                                header.getContext(),
                              )
                            : header.column.columnDef.header
                          : null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "actions" ? "relative" : ""
                        }
                        style={
                          cell.column.id === "actions"
                            ? {
                                overflow: "visible",
                                position: "relative",
                                zIndex: 1,
                              }
                            : undefined
                        }
                      >
                        {typeof cell.column.columnDef.cell === "function"
                          ? cell.column.columnDef.cell(cell.getContext())
                          : cell.getValue() != null
                            ? String(cell.getValue())
                            : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground text-sm">
          {data?.pagination ? (
            <>
              Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                data.pagination.total,
              )}{" "}
              of {data.pagination.total} users
              <span className="ml-2 text-xs">
                (Page {pagination.pageIndex + 1} of {data.pagination.totalPages}
                )
              </span>
            </>
          ) : (
            "Loading..."
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            style={{
              position: "relative",
              zIndex: 5,
              pointerEvents: "auto",
            }}
            onClick={() => {
              table.previousPage();
            }}
            disabled={!canPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            style={{
              position: "relative",
              zIndex: 5,
              pointerEvents: "auto",
            }}
            onClick={() => {
              table.nextPage();
            }}
            disabled={!canNextPage}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => {
          if (!open && !deletingUserId) {
            setUserToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action
              cannot be undone and will permanently remove the user from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                handleCancelDelete();
              }}
              disabled={deletingUserId === userToDelete?.id}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete);
                }
              }}
              disabled={deletingUserId === userToDelete?.id}
              className="bg-destructive hover:bg-destructive/90 disabled:opacity-50"
            >
              {deletingUserId === userToDelete?.id
                ? "Deleting..."
                : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
