'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus, FileUp, Users, Filter, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Rocket from '@/shared/Rocket';
import { useContactStore } from '@/store/contactStore';
import { ContactTypes } from '@/types/interface';
import { toast } from '@/hooks/use-toast';

export default function AudiencePage() {
  const [activeTab, setActiveTab] = useState('all-contacts');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState<
    Omit<ContactTypes, 'id' | 'contactDate' | 'user_id'>
  >({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    group: '',
    address: '',
  });

  const { contacts, loading, listAllContacts, addContact } = useContactStore();

  useEffect(() => {
    listAllContacts();
  }, [listAllContacts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const filteredContacts =
    contacts?.filter(
      (contact) =>
        `${contact.first_name} ${contact.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
    ) || [];

  const handleAddContact = async () => {
    if (newContact.first_name && newContact.last_name && newContact.email && newContact.phone) {
      try {
        await addContact(
          newContact.first_name,
          newContact.last_name,
          newContact.email,
          newContact.phone,
          newContact.group
        );
        setIsAddContactOpen(false);
        toast({
          title: 'Contact Added',
          description: 'Your new contact has been successfully added.',
          variant: 'success',
        });

        // Reset form
        setNewContact({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          group: '',
          address: '',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to add contact. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill all required fields.',
        variant: 'warning',
      });
    }
  };

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const handleDeleteContacts = async () => {
    try {
      await deleteMultipleContacts(selectedContacts);
      setSelectedContacts([]);
      setIsDeleteModalOpen(false);
      toast({
        title: 'Contacts Deleted',
        description: 'Selected contacts have been successfully removed.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: 'Unable to delete contacts. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <motion.div
      className="p-6 mx-auto max-w-7xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0D0F56]">Audience Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileUp className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button size="sm" onClick={() => setIsAddContactOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading contacts...</div>
      ) : contacts && contacts.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all-contacts">
                  <Users className="mr-2 h-4 w-4" /> All Contacts
                </TabsTrigger>
                <TabsTrigger value="groups">
                  <Filter className="mr-2 h-4 w-4" /> Groups
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search contacts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-3 rounded-lg flex justify-between items-center mb-4"
            >
              <span>{selectedContacts.length} contacts selected</span>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
              </Button>
            </motion.div>
          )}

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedContacts.length === filteredContacts.length}
                      onCheckedChange={() =>
                        setSelectedContacts(
                          selectedContacts.length === filteredContacts.length
                            ? []
                            : filteredContacts.map((c) => c.id)
                        )
                      }
                    />
                  </TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => handleSelectContact(contact.id)}
                      />
                    </TableCell>
                    <TableCell>{`${contact.first_name} ${contact.last_name}`}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.group || 'Unassigned'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={() => deleteContact(contact.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-2xl p-8 mx-auto max-w-md shadow-lg">
            <Rocket />
            <h2 className="text-[#0D0F56] text-3xl font-semibold mb-4">Grow your Audience</h2>
            <p className="text-gray-600 mb-6">
              Here is where you will add and manage your contacts. Once your first contact is added,
              you will be able to send your first campaign.
            </p>
            <Button
              size="lg"
              className="bg-[#2E3192] hover:bg-[#1C1E5F]"
              onClick={() => setIsAddContactOpen(true)}
            >
              Add First Contact
            </Button>
          </div>
        </motion.div>
      )}

      {/* Add Contact Sheet */}
      <Sheet open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Create New Contact</SheetTitle>
            <SheetDescription>Fill in the contact details carefully.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                First Name
              </Label>
              <Input
                id="first_name"
                value={newContact.first_name}
                onChange={(e) => setNewContact({ ...newContact, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Last Name
              </Label>
              <Input
                id="last_name"
                value={newContact.last_name}
                onChange={(e) => setNewContact({ ...newContact, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group" className="text-right">
                Group
              </Label>
              <Select
                value={newContact.group}
                onValueChange={(value) => setNewContact({ ...newContact, group: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Group A">Group A</SelectItem>
                  <SelectItem value="Group B">Group B</SelectItem>
                  <SelectItem value="Group C">Group C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contacts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedContacts.length} contact(s)? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteContacts}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}