"use client"

import { useState, useMemo } from "react"
import {
  Search,
  User,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  X,
  Menu,
  Filter,
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  Heart,
  Zap,
  Truck,
  Shield,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Dados fictícios dos produtos
const produtos = [
  {
    id: 1,
    nome: "Smartphone Galaxy Pro",
    preco: 899.99,
    categoria: "Eletrônicos",
    descricao: "Smartphone com câmera de 108MP e 128GB de armazenamento interno",
    avaliacao: 4.5,
    numeroAvaliacoes: 234,
    imagem: "/placeholder.svg?height=300&width=300",
    destaque: true,
    tags: ["smartphone", "galaxy", "câmera", "android"],
  },
  {
    id: 2,
    nome: "Camiseta Premium Cotton",
    preco: 49.99,
    categoria: "Roupas",
    descricao: "Camiseta 100% algodão, confortável e durável para o dia a dia",
    avaliacao: 4.2,
    numeroAvaliacoes: 156,
    imagem: "/placeholder.svg?height=300&width=300",
    destaque: true,
    tags: ["camiseta", "algodão", "casual", "conforto"],
  },
  {
    id: 3,
    nome: "Livro: Programação Moderna",
    preco: 79.9,
    categoria: "Livros",
    descricao: "Guia completo para desenvolvimento web moderno com React e Node.js",
    avaliacao: 4.8,
    numeroAvaliacoes: 89,
    imagem: "/placeholder.svg?height=300&width=300",
    destaque: true,
    tags: ["programação", "react", "nodejs", "desenvolvimento"],
  },
  {
    id: 4,
    nome: "Fone Bluetooth Premium",
    preco: 199.99,
    categoria: "Eletrônicos",
    descricao: "Fone sem fio com cancelamento de ruído ativo e bateria de longa duração",
    avaliacao: 4.3,
    numeroAvaliacoes: 312,
    imagem: "/placeholder.svg?height=300&width=300",
    destaque: false,
    tags: ["fone", "bluetooth", "sem fio", "cancelamento ruído"],
  },
  {
    id: 5,
    nome: "Jaqueta Jeans Clássica",
    preco: 129.99,
    categoria: "Roupas",
    descricao: "Jaqueta jeans vintage, estilo atemporal para todas as ocasiões",
    avaliacao: 4.1,
    numeroAvaliacoes: 78,
    imagem: "/placeholder.svg?height=300&width=300",
    destaque: false,
    tags: ["jaqueta", "jeans", "vintage", "casual"],
  },
  {
    id: 6,
    nome: "Cookbook Gourmet",
    preco: 59.9,
    categoria: "Livros",
    descricao: "Receitas exclusivas de chefs renomados do mundo todo",
    avaliacao: 4.6,
    numeroAvaliacoes: 145,
    imagem: "/placeholder.svg?height=300&width=300",
    destaque: false,
    tags: ["culinária", "receitas", "gourmet", "chef"],
  },
  {
    id: 7,
    nome: "Notebook Ultrabook",
    preco: 1299.99,
    categoria: "Eletrônicos",
    descricao: "Notebook leve e potente para trabalho e estudos com SSD 512GB",
    avaliacao: 4.7,
    numeroAvaliacoes: 198,
    imagem: "/placeholder.svg?height=300&width=300",
    destaque: false,
    tags: ["notebook", "ultrabook", "trabalho", "ssd"],
  },
  {
    id: 8,
    nome: "Tênis Esportivo Pro",
    preco: 159.99,
    categoria: "Roupas",
    descricao: "Tênis para corrida com tecnologia avançada de amortecimento",
    avaliacao: 4.4,
    numeroAvaliacoes: 267,
    imagem: "/placeholder.svg?height=300&width=300",
    destaque: false,
    tags: ["tênis", "esportivo", "corrida", "amortecimento"],
  },
]

const categorias = ["Todos", "Eletrônicos", "Roupas", "Livros"]

interface ItemCarrinho {
  produto: (typeof produtos)[0]
  quantidade: number
}

interface Usuario {
  nome: string
  email: string
  logado: boolean
}

export default function LojaVirtual() {
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos")
  const [termoBusca, setTermoBusca] = useState("")
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)
  const [loginAberto, setLoginAberto] = useState(false)
  const [usuario, setUsuario] = useState<Usuario>({ nome: "", email: "", logado: false })
  const [carregandoLogin, setCarregandoLogin] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [produtoCarregando, setProdutoCarregando] = useState<number | null>(null)

  const { toast } = useToast()

  // Filtro de produtos com busca e categoria
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const matchCategoria = categoriaFiltro === "Todos" || produto.categoria === categoriaFiltro
      const matchBusca =
        termoBusca === "" ||
        produto.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
        produto.tags.some((tag) => tag.toLowerCase().includes(termoBusca.toLowerCase()))

      return matchCategoria && matchBusca
    })
  }, [categoriaFiltro, termoBusca])

  const produtosDestaque = produtos.filter((produto) => produto.destaque)

  const adicionarAoCarrinho = async (produto: (typeof produtos)[0]) => {
    setProdutoCarregando(produto.id)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    setCarrinho((prev) => {
      const itemExistente = prev.find((item) => item.produto.id === produto.id)
      if (itemExistente) {
        toast({
          title: "Produto atualizado!",
          description: `${produto.nome} - quantidade aumentada no carrinho`,
        })
        return prev.map((item) =>
          item.produto.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item,
        )
      }
      toast({
        title: "Produto adicionado!",
        description: `${produto.nome} foi adicionado ao carrinho`,
      })
      return [...prev, { produto, quantidade: 1 }]
    })

    setProdutoCarregando(null)
  }

  const removerDoCarrinho = (produtoId: number) => {
    const produto = produtos.find((p) => p.id === produtoId)
    setCarrinho((prev) => prev.filter((item) => item.produto.id !== produtoId))
    toast({
      title: "Produto removido",
      description: `${produto?.nome} foi removido do carrinho`,
      variant: "destructive",
    })
  }

  const atualizarQuantidade = (produtoId: number, novaQuantidade: number) => {
    if (novaQuantidade === 0) {
      removerDoCarrinho(produtoId)
      return
    }
    setCarrinho((prev) =>
      prev.map((item) => (item.produto.id === produtoId ? { ...item, quantidade: novaQuantidade } : item)),
    )
  }

  const toggleFavorito = (produtoId: number) => {
    const produto = produtos.find((p) => p.id === produtoId)
    setFavoritos((prev) => {
      const isFavorito = prev.includes(produtoId)
      if (isFavorito) {
        toast({
          title: "Removido dos favoritos",
          description: `${produto?.nome} foi removido dos favoritos`,
        })
        return prev.filter((id) => id !== produtoId)
      } else {
        toast({
          title: "Adicionado aos favoritos",
          description: `${produto?.nome} foi adicionado aos favoritos`,
        })
        return [...prev, produtoId]
      }
    })
  }

  const handleLogin = async (email: string, senha: string) => {
    setCarregandoLogin(true)

    // Simular autenticação
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email && senha) {
      setUsuario({
        nome: email.split("@")[0],
        email,
        logado: true,
      })
      setLoginAberto(false)
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta, ${email.split("@")[0]}!`,
      })
    } else {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      })
    }

    setCarregandoLogin(false)
  }

  const handleRegistro = async (nome: string, email: string, senha: string) => {
    setCarregandoLogin(true)

    // Simular registro
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (nome && email && senha) {
      setUsuario({
        nome,
        email,
        logado: true,
      })
      setLoginAberto(false)
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo, ${nome}!`,
      })
    } else {
      toast({
        title: "Erro no registro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
    }

    setCarregandoLogin(false)
  }

  const handleLogout = () => {
    setUsuario({ nome: "", email: "", logado: false })
    setFavoritos([])
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    })
  }

  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0)
  const subtotal = carrinho.reduce((total, item) => total + item.produto.preco * item.quantidade, 0)

  const renderEstrelas = (avaliacao: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(avaliacao) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  const CardProduto = ({ produto }: { produto: (typeof produtos)[0] }) => {
    const isFavorito = favoritos.includes(produto.id)
    const isCarregando = produtoCarregando === produto.id

    return (
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-2 right-2 z-10">
          <Button
            size="icon"
            variant="ghost"
            className={`h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white ${
              isFavorito ? "text-red-500" : "text-gray-400"
            }`}
            onClick={() => toggleFavorito(produto.id)}
          >
            <Heart className={`h-4 w-4 ${isFavorito ? "fill-current" : ""}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={produto.imagem || "/placeholder.svg"}
              alt={produto.nome}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {produto.destaque && (
              <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
                <Zap className="w-3 h-3 mr-1" />
                Destaque
              </Badge>
            )}
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {produto.nome}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{produto.descricao}</p>

          <div className="flex items-center gap-1 mb-2">
            {renderEstrelas(produto.avaliacao)}
            <span className="text-sm text-gray-500 ml-1">({produto.numeroAvaliacoes})</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-green-600">R$ {produto.preco.toFixed(2)}</span>
            <div className="flex gap-1">
              {produto.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={() => adicionarAoCarrinho(produto)}
            className="w-full group-hover:bg-blue-600 transition-colors"
            disabled={isCarregando}
          >
            {isCarregando ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adicionando...
              </div>
            ) : (
              "Adicionar ao Carrinho"
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const FormularioLogin = () => {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pl-10 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button onClick={() => handleLogin(email, senha)} className="w-full" disabled={carregandoLogin}>
          {carregandoLogin ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Entrando...
            </div>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </>
          )}
        </Button>
      </div>
    )
  }

  const FormularioRegistro = () => {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <Input id="nome" type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-registro">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="email-registro"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="senha-registro">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="senha-registro"
              type={mostrarSenha ? "text" : "password"}
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="pl-10 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button onClick={() => handleRegistro(nome, email, senha)} className="w-full" disabled={carregandoLogin}>
          {carregandoLogin ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Criando conta...
            </div>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Criar conta
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Sheet open={menuMobileAberto} onOpenChange={setMenuMobileAberto}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Categorias</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    {categorias.map((categoria) => (
                      <Button
                        key={categoria}
                        variant={categoriaFiltro === categoria ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setCategoriaFiltro(categoria)
                          setMenuMobileAberto(false)
                        }}
                      >
                        {categoria}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-bold text-gray-900 ml-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechStore
              </h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar produtos, marcas, categorias..."
                  className="pl-10 pr-4 focus:ring-2 focus:ring-blue-500 transition-all"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                {termoBusca && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setTermoBusca("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Dialog open={loginAberto} onOpenChange={setLoginAberto}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex relative">
                    <User className="h-6 w-6" />
                    {usuario.logado && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></div>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{usuario.logado ? `Olá, ${usuario.nome}!` : "Acesse sua conta"}</DialogTitle>
                  </DialogHeader>

                  {usuario.logado ? (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">Você está logado como:</p>
                        <p className="font-semibold text-green-800">{usuario.email}</p>
                      </div>
                      <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                        Sair da conta
                      </Button>
                    </div>
                  ) : (
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Entrar</TabsTrigger>
                        <TabsTrigger value="registro">Criar conta</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login" className="mt-4">
                        <FormularioLogin />
                      </TabsContent>
                      <TabsContent value="registro" className="mt-4">
                        <FormularioRegistro />
                      </TabsContent>
                    </Tabs>
                  )}
                </DialogContent>
              </Dialog>

              <Sheet open={carrinhoAberto} onOpenChange={setCarrinhoAberto}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-6 w-6" />
                    {totalItens > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse">
                        {totalItens}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg">
                  <SheetHeader>
                    <SheetTitle className="flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Carrinho de Compras
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex-1 overflow-y-auto">
                    {carrinho.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Seu carrinho está vazio</p>
                        <p className="text-sm">Adicione produtos para começar suas compras</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {carrinho.map((item) => (
                          <div
                            key={item.produto.id}
                            className="flex items-center space-x-4 bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
                          >
                            <Image
                              src={item.produto.imagem || "/placeholder.svg"}
                              alt={item.produto.nome}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{item.produto.nome}</h4>
                              <p className="text-green-600 font-semibold">R$ {item.produto.preco.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent hover:bg-gray-100"
                                onClick={() => atualizarQuantidade(item.produto.id, item.quantidade - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantidade}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent hover:bg-gray-100"
                                onClick={() => atualizarQuantidade(item.produto.id, item.quantidade + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:bg-red-50"
                                onClick={() => removerDoCarrinho(item.produto.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {carrinho.length > 0 && (
                    <div className="border-t pt-4 mt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Subtotal:</span>
                        <span className="text-xl font-bold text-green-600">R$ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        <Truck className="h-4 w-4 mr-2 text-blue-600" />
                        Frete grátis para compras acima de R$ 100
                      </div>
                      <Button className="w-full" size="lg">
                        Finalizar Compra
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Barra de busca mobile */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-10 pr-4"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            {termoBusca && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setTermoBusca("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Banner de benefícios */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Frete grátis acima de R$ 100
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Compra 100% segura
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Entrega rápida
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de filtros - Desktop */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Categorias
              </h2>
              <div className="space-y-2">
                {categorias.map((categoria) => (
                  <Button
                    key={categoria}
                    variant={categoriaFiltro === categoria ? "default" : "ghost"}
                    className="w-full justify-start hover:bg-blue-50 transition-colors"
                    onClick={() => setCategoriaFiltro(categoria)}
                  >
                    {categoria}
                  </Button>
                ))}
              </div>

              {termoBusca && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Buscando por: <strong>"{termoBusca}"</strong>
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTermoBusca("")}
                    className="mt-2 text-blue-600 hover:text-blue-800"
                  >
                    Limpar busca
                  </Button>
                </div>
              )}
            </div>
          </aside>

          {/* Conteúdo principal */}
          <main className="flex-1">
            {/* Filtro mobile */}
            <div className="md:hidden mb-6">
              <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Produtos em destaque */}
            {categoriaFiltro === "Todos" && !termoBusca && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Zap className="h-6 w-6 mr-2 text-orange-500" />
                  Produtos em Destaque
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {produtosDestaque.map((produto) => (
                    <CardProduto key={produto.id} produto={produto} />
                  ))}
                </div>
              </section>
            )}

            {/* Grade de produtos */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {termoBusca
                    ? `Resultados para "${termoBusca}"`
                    : categoriaFiltro === "Todos"
                      ? "Todos os Produtos"
                      : categoriaFiltro}
                </h2>
                <span className="text-gray-500">
                  {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""} encontrado
                  {produtosFiltrados.length !== 1 ? "s" : ""}
                </span>
              </div>

              {produtosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-500 mb-4">
                    {termoBusca
                      ? `Não encontramos produtos para "${termoBusca}". Tente outros termos.`
                      : "Não há produtos nesta categoria no momento."}
                  </p>
                  {termoBusca && (
                    <Button onClick={() => setTermoBusca("")} variant="outline">
                      Limpar busca
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {produtosFiltrados.map((produto) => (
                    <CardProduto key={produto.id} produto={produto} />
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TechStore
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Sua loja online de confiança para tecnologia, moda e muito mais.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Compra 100% segura</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Institucional</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carreiras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Imprensa
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Investidores
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Atendimento</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fale Conosco
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trocas e Devoluções
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Entrega
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 TechStore. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
